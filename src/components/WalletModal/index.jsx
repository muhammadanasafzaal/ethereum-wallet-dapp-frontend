import { motion, AnimatePresence } from "framer-motion";

const WalletModal = ({ isOpen, onClose, account }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl w-[90%] max-w-sm"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Connected Account</h2>
            <p className="break-words text-gray-600 dark:text-gray-300 mb-6">
              {account || "No wallet connected."}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-black hover:bg-gray-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;
