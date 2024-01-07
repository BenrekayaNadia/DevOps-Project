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
            withCredentials([dockerUsernamePassword(credentialsId: 'dh_crede', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                echo "DOCKERHUB_CREDENTIALS_USR: $DOCKERHUB_CREDENTIALS_USR"
                echo "DOCKERHUB_CREDENTIALS_PSW: $DOCKERHUB_CREDENTIALS_PSW"

                def loginCmd = "docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW"
                echo "Running: $loginCmd"
                sh "$loginCmd"
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
