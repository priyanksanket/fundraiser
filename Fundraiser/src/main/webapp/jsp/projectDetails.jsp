<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Details - Fundraiser</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <h2 class="text-center">${project.title}</h2>
                <div class="mb-3">
                    <p class="lead">${project.description}</p>
                </div>
                <div class="mb-3">
                    <h4>Funding Goal: <span class="text-success">${project.goalAmount}</span></h4>
                    <p>Current Funds Raised: <span class="text-info">${project.fundsRaised}</span></p>
                    <p>Status: <span class="badge bg-${project.fundsRaised >= project.goalAmount ? 'success' : 'warning'}">
                        ${project.fundsRaised >= project.goalAmount ? 'Goal Reached' : 'In Progress'}</span>
                    </p>
                </div>
                <div class="mb-4">
                    <h5>Backers:</h5>
                    <ul>
                        <c:forEach var="backer" items="${project.backers}">
                            <li>${backer.name} - ${backer.donationAmount}</li>
                        </c:forEach>
                    </ul>
                </div>
                <form action="donate" method="post">
                    <input type="hidden" name="projectId" value="${project.id}">
                    <div class="mb-3">
                        <label for="donationAmount" class="form-label">Your Donation Amount</label>
                        <input type="number" name="donationAmount" id="donationAmount" class="form-control" required min="1">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Donate Now</button>
                </form>
                <p class="text-center mt-3">
                    <a href="home.jsp" class="btn btn-secondary">Back to Home</a>
                </p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
