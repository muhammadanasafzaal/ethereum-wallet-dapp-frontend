import { createContext, useEffect, useState } from "react";
import { ethers } from 'ethers'
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = createContext()

const { ethereum } = window

const createEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(ethereum)

    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract
}


export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();

                const availableTransactions = await transactionsContract.getAllTransactions();

                const structuredTransactions = availableTransactions.map(tx => ({
                    addressTo:   tx.receiver,
                    addressFrom: tx.sender,
                    timestamp:   new Date(Number(tx.timestamp) * 1000).toLocaleString(),
                    message:     tx.message,
                    keyword:     tx.keyword,
                    amount:      parseFloat(ethers.formatEther(tx.amount)),  // <— formats wei → “0.0005”
                }));

                console.log(structuredTransactions);

                setTransactions(structuredTransactions);
            } else {
                console.log("Ethereum is not present");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please connect meta mask")

            const accounts = await ethereum.request({ method: 'eth_accounts' })
            if (accounts.length) {
                setCurrentAccount(accounts[0])

                await getAllTransactions()
            }
            else {
                console.log('No accounts found')
            }
        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please connect meta mask")

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    const checkIfTransactionsExists = async () => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();
                const currentTransactionCount = await transactionsContract.getTransactionCount();

                window.localStorage.setItem("transactionCount", currentTransactionCount);
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please connect meta mask")

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = await createEthereumContract()

            const parsedAmount = ethers.parseEther(amount);           // BigInt, e.g. 500000000000000n
            const hexAmount = '0x' + parsedAmount.toString(16);   // toString(16) → hex digits

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',           // 21000 gas limit
                    value: hexAmount,         // e.g. '0x1c6bf52634000'
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)

            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success - ${transactionHash.hash}`)

            const transactionCount = await transactionContract.getAllTransactionCount()
            console.log(Number(transactionCount))
            setTransactionCount(Number(transactionCount))
        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionsExists();
    }, [])


    return (
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                handleChange,
                formData,
                isLoading,
                sendTransaction,
                transactions,
                transactionCount
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}