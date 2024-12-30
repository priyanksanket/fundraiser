<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Fundraiser</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="home.jsp">Fundraiser</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="home.jsp">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="createProject.jsp">Create Project</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="userProfile.jsp">Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="logout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-5">
        <h2 class="text-center mb-4">Welcome, ${user.name}!</h2>

        <div class="row">
            <!-- Featured Projects Section -->
            <div class="col-md-12 mb-4">
                <h3 class="text-center">Featured Projects</h3>
                <div class="row">
                    <c:forEach var="project" items="${featuredProjects}">
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <img src="${project.imageUrl}" class="card-img-top" alt="${project.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${project.title}</h5>
                                    <p class="card-text">${project.description}</p>
                                    <a href="projectDetails.jsp?projectId=${project.id}" class="btn btn-primary">View Details</a>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </div>

            <!-- Ongoing Projects Section -->
            <div class="col-md-12 mb-4">
                <h3 class="text-center">Ongoing Projects</h3>
                <div class="row">
                    <c:forEach var="project" items="${ongoingProjects}">
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <img src="${project.imageUrl}" class="card-img-top" alt="${project.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${project.title}</h5>
                                    <p class="card-text">${project.description}</p>
                                    <a href="projectDetails.jsp?projectId=${project.id}" class="btn btn-primary">View Details</a>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </div>
        </div>

        <div class="text-center mt-5">
            <a href="createProject.jsp" class="btn btn-success">Start Your Own Project</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
