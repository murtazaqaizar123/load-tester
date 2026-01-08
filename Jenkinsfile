pipeline {
    agent any

    environment {
        K6_BROWSER_ENABLED = 'true'
        K6_BROWSER_ARGS = 'no-sandbox,disable-setuid-sandbox,disable-dev-shm-usage,disable-gpu'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install k6 & Reporter') {
            steps {
                script {
                    sh '''
                        if [ ! -f "./k6" ]; then
                            curl -L https://github.com/grafana/k6/releases/download/v0.51.0/k6-v0.51.0-linux-amd64.tar.gz | tar -xz --strip-components 1
                        fi
                        curl -L https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js -o reporter.js
                    '''
                }
            }
        }

        stage('Run Load Test') {
            steps {
                script {
                    // This command runs the JAVASCRIPT file using the k6 binary
                    sh './k6 run load-test.js'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'summary.html', fingerprint: true
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: '.',
                reportFiles: 'summary.html',
                reportName: 'K6 Browser Load Report'
            ])
        }
    }
}
