FROM jenkins/jenkins:lts-jdk17

# Switch to root to install packages and access the docker socket
USER root

# Install Maven and Docker CLI
RUN apt-get update && \
    apt-get install -y maven docker.io && \
    rm -rf /var/lib/apt/lists/*

# Keep user as root so Jenkins has permission to read/write to the Windows Docker socket (/var/run/docker.sock)

