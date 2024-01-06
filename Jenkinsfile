pipeline {
    agent any

    stages {
        stage("Test"){
            steps {
                echo "Testing ..."
            }
        }
        stage("Build"){
            steps {
                echo "Building ..."
            }
        }
        stage("Deploy"){
            steps {
                echo "Deploying ..."
                sh 'npm start' 
            }
        }
        stage("CheckVersion"){
            steps {
                echo "Build version: ${env.BUILD_ID}"
            }
        }
    }
}