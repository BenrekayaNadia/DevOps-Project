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
            agent any
            steps {
                checkout scm
            }
        }

        stage('Init') {
            steps {
                // Use the withCredentials block for a cleaner approach
                withCredentials([string(credentialsId: 'dh_crede', variable: 'DOCKERHUB_CREDENTIALS_PSW'),
                                 [$class: 'UsernamePasswordMultiBinding', credentialsId: 'dh_crede', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW']]) {
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
