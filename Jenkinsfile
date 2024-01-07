pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_USR = 'nediabenrekaya'
    }

    triggers {
        pollSCM('*/5 * * * *')
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Init') {
            steps {
                withCredentials([string(credentialsId: 'dh_crede', variable: 'DOCKERHUB_CREDENTIALS_PSW'),
                                 string(credentialsId: 'dh_crede', variable: 'DOCKERHUB_CREDENTIALS_USR')]) {
                    echo "DOCKERHUB_CREDENTIALS_USR: $DOCKERHUB_CREDENTIALS_USR"
                    echo "DOCKERHUB_CREDENTIALS_PSW: $DOCKERHUB_CREDENTIALS_PSW"
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
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

        stage('Cleanup') {
            steps {
                echo "Cleaning up..."
                sh 'docker rmi $DOCKERHUB_CREDENTIALS_USR/devops-project:$BUILD_ID'
                sh 'docker logout'
            }
        }
    }
}
