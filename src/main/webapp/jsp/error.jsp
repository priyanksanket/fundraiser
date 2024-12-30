<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Fundraiser</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h2 class="text-center text-danger">Oops! Something went wrong.</h2>
                <div class="alert alert-danger">
                    <h5>Error Details</h5>
                    <ul>
                        <li><strong>Status Code:</strong> ${statusCode}</li>
                        <li><strong>Message:</strong> ${errorMessage}</li>
                        <li><strong>Request URI:</strong> ${requestUri}</li>
                    </ul>
                </div>
                <p>We are sorry for the inconvenience. Please try again later or <a href="welcome.jsp">go back to the homepage</a>.</p>
                <p>If you continue to experience issues, please contact support.</p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
