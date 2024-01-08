pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('cred')
        DOCKERHUB_CREDENTIALS_USR = "${DOCKERHUB_CREDENTIALS_USR}"
        BUILD_ID = "${BUILD_ID}"
    }

    triggers {
        pollSCM('*/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $DOCKERHUB_CREDENTIALS_USR/devops-project:$BUILD_ID .'
            }
        }

        stage('Deliver') {
    steps {
        echo "Pushing Docker image..."
        script {
            def pushCmd = "docker push $DOCKERHUB_CREDENTIALS_USR/devops-project:$BUILD_ID"
            try {
                sh pushCmd
            } catch (Exception e) {
                echo "Error details: ${e.getMessage()}"
                error "Failed to push Docker image."
            }
        }
    }
}

        stage('Cleanup') {
            steps {
                echo "Cleaning up..."
                sh 'docker rmi $DOCKERHUB_CREDENTIALS_USR/devops-project:$BUILD_ID'
                sh 'docker logout'
            }
        }
    }
}
