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
                script {
                    def dockerhub_credentials = credentials('dh_crede')
                    withCredentials([dockerUsernamePassword(credentialsId: 'dh_crede', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW'),
                                     usernamePassword(credentialsId: 'docker-login-creds', usernameVariable: 'username', passwordVariable: 'password')]) {
                        echo "DOCKERHUB_CREDENTIALS_USR: $DOCKERHUB_CREDENTIALS_USR"
                        echo "DOCKERHUB_CREDENTIALS_PSW: $DOCKERHUB_CREDENTIALS_PSW"

                        def loginCmd = "docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW"
                        echo "Running: $loginCmd"
                        sh "$loginCmd"

                        // Additional Docker login
                        sh '''
                            echo "${password}" | docker login -u ${username} --password-stdin
                            docker stop docker_image
                            docker rm docker_image
                            docker pull docker_image:latest
                            docker run -d -p 80:80 --name docker-image-name -t docker_image:latest
                        '''
                    }
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
