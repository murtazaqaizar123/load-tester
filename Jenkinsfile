pipeline {
    agent any

    environment {
        K6_BROWSER_ENABLED = 'true'
        K6_BROWSER_ARGS = 'no-sandbox,disable-setuid-sandbox,disable-dev-shm-usage,disable-gpu'
    }

    stages {
        stage('Cleanup & Setup') {
            steps {
                script {
                    // Remove old binary and reporter to ensure a clean state
                    sh 'rm -f k6 reporter.js'
                    
                    echo "Downloading k6 v0.51.0..."
                    sh 'curl -L https://github.com/grafana/k6/releases/download/v0.51.0/k6-v0.51.0-linux-amd64.tar.gz | tar -xz --strip-components 1'
                    
                    echo "Downloading k6-reporter v2.4.0..."
                    sh 'curl -L https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js -o reporter.js'
                }
            }
        }

        stage('Verify Version') {
            steps {
                // This confirms exactly which version Jenkins is using
                sh './k6 version'
            }
        }

        stage('Run Load Test') {
            steps {
                // Use the local binary
                sh './k6 run load-test.js'
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
