import java.sql.*;
import java.util.*;

class Db {
    private Connection conn;

    // Constructor to establish database connection
    public Db() {
        try {
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/crowdfunding", "root", "");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Select query for multiple rows
    public List<Map<String, Object>> select(String query) {
        List<Map<String, Object>> results = new ArrayList<>();
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            ResultSetMetaData metaData = rs.getMetaData();
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                    row.put(metaData.getColumnName(i), rs.getObject(i));
                }
                results.add(row);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return results;
    }

    // Select query for a single row
    public Map<String, Object> selectOne(String query) {
        List<Map<String, Object>> results = select(query);
        return results.isEmpty() ? null : results.get(0);
    }

    // Insert query
    public int insert(String query) {
        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(query, Statement.RETURN_GENERATED_KEYS);
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    // Update query
    public int update(String query) {
        try (Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(query);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    // Delete query
    public int delete(String query) {
        try (Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(query);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }
}

class Blockchain {
    // Mock class for blockchain interaction
    public boolean isConnected() {
        // Replace with actual blockchain connection logic
        return true;
    }

    public void transferFunds(String from, String to, String privateKey, double amount) {
        // Mock implementation for transferring funds
        System.out.println("Transferred " + amount + " ether from " + from + " to " + to);
    }
}

public class Crowdfunding {
    private static Db db = new Db();
    private static Blockchain blockchain = new Blockchain();

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("\nCrowdfunding Menu");
            System.out.println("1. View Campaigns");
            System.out.println("2. Create Campaign");
            System.out.println("3. Donate to Campaign");
            System.out.println("4. Exit");
            System.out.print("Choose an option: ");
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    viewCampaigns();
                    break;
                case 2:
                    createCampaign(scanner);
                    break;
                case 3:
                    donateToCampaign(scanner);
                    break;
                case 4:
                    System.out.println("Exiting...");
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }

    private static void viewCampaigns() {
        String query = "SELECT * FROM campaigns";
        List<Map<String, Object>> campaigns = db.select(query);
        if (campaigns.isEmpty()) {
            System.out.println("No campaigns available.");
        } else {
            for (Map<String, Object> campaign : campaigns) {
                System.out.println("ID: " + campaign.get("id"));
                System.out.println("Title: " + campaign.get("title"));
                System.out.println("Description: " + campaign.get("description"));
                System.out.println("Goal: $" + campaign.get("goal"));
                System.out.println("Amount Raised: $" + campaign.get("amount_raised"));
                System.out.println("----------------------------");
            }
        }
    }

    private static void createCampaign(Scanner scanner) {
        System.out.print("Enter campaign title: ");
        String title = scanner.nextLine();

        System.out.print("Enter campaign description: ");
        String description = scanner.nextLine();

        System.out.print("Enter funding goal: ");
        double goal = scanner.nextDouble();
        scanner.nextLine(); // Consume newline

        String query = String.format(
            "INSERT INTO campaigns (title, description, goal, amount_raised) VALUES ('%s', '%s', %.2f, 0)",
            title, description, goal);
        int campaignId = db.insert(query);
        if (campaignId > 0) {
            System.out.println("Campaign created successfully with ID: " + campaignId);
        } else {
            System.out.println("Error creating campaign.");
        }
    }

    private static void donateToCampaign(Scanner scanner) {
        System.out.print("Enter campaign ID to donate to: ");
        int campaignId = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        String query = "SELECT * FROM campaigns WHERE id = " + campaignId;
        Map<String, Object> campaign = db.selectOne(query);
        if (campaign == null) {
            System.out.println("Campaign not found.");
            return;
        }

        System.out.print("Enter donation amount: ");
        double amount = scanner.nextDouble();
        scanner.nextLine(); // Consume newline

        double amountRaised = (double) campaign.get("amount_raised") + amount;
        query = String.format("UPDATE campaigns SET amount_raised = %.2f WHERE id = %d", amountRaised, campaignId);
        if (db.update(query) > 0) {
            System.out.println("Donation successful! Thank you for your support.");
        } else {
            System.out.println("Error processing donation.");
        }
    }
}
