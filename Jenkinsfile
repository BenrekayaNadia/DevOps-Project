pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_USR = credentials('dh_crede')
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
                sh 'docker push $DOCKERHUB_CREDENTIALS_USR/devops-project:$BUILD_ID'
            }
        }

        
    }
}
