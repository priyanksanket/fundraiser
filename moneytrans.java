import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.http.HttpService;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.utils.Convert;
import org.web3j.utils.Numeric;

import java.math.BigDecimal;
import java.math.BigInteger;

public class EthereumTransaction {

    public static void main(String[] args) {
        try {
            // Connect to the blockchain
            String blockchainAddress = "http://127.0.0.1:7545";
            Web3j web3 = Web3j.build(new HttpService(blockchainAddress));
            System.out.println("Connected to Ethereum blockchain: " + web3.web3ClientVersion().send().getWeb3ClientVersion());

            // Define accounts
            String acc1 = "0x1490458B3cc38D303A48d8DCa17cE4A51179D3A8";
            String acc2 = "0xE465072A2276Cd69a5d8B4226375bA98305Cd46e";

            // Define private key
            String prvkey = "0x572a7b3ec551c727edac423ab45cc14065b68121bb81208fff390bfb62bcde8a";
            Credentials credentials = Credentials.create(prvkey);

            // Get nonce
            EthGetTransactionCount ethGetTransactionCount = web3.ethGetTransactionCount(
                    acc1, DefaultBlockParameterName.LATEST).send();
            BigInteger nonce = ethGetTransactionCount.getTransactionCount();

            // Check balance
            BigInteger balance = web3.ethGetBalance(acc1, DefaultBlockParameterName.LATEST).send().getBalance();
            BigDecimal balanceInEther = Convert.fromWei(balance.toString(), Convert.Unit.ETHER);
            System.out.println("Balance of account 1: " + balanceInEther + " ETH");

            // Create transaction
            BigInteger value = Convert.toWei("90", Convert.Unit.ETHER).toBigInteger(); // 90 ETH
            BigInteger gasLimit = BigInteger.valueOf(200000);
            BigInteger gasPrice = Convert.toWei("50", Convert.Unit.GWEI).toBigInteger();

            RawTransaction rawTransaction = RawTransaction.createEtherTransaction(
                    nonce, gasPrice, gasLimit, acc2, value);

            // Sign the transaction
            byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
            String signedTransaction = Numeric.toHexString(signedMessage);

            // Send the transaction
            String transactionHash = web3.ethSendRawTransaction(signedTransaction).send().getTransactionHash();
            System.out.println("Transaction hash: " + transactionHash);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
