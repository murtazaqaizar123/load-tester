pipeline {
    agent any

    environment {
        K6_BROWSER_ENABLED = 'true'
        // These flags are vital for running Chrome inside a Docker container
        K6_BROWSER_ARGS = 'no-sandbox,disable-setuid-sandbox,disable-dev-shm-usage,disable-gpu,headless'
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
                        # 1. Download k6 binary if missing
                        if [ ! -f "./k6" ]; then
                            echo "Downloading k6..."
                            curl -L https://github.com/grafana/k6/releases/download/v0.51.0/k6-v0.51.0-linux-amd64.tar.gz | tar -xz --strip-components 1
                        fi

                        # 2. Download the VERSIONED reporter (fixes the SyntaxError)
                        echo "Downloading compatible k6-reporter v2.4.0..."
                        curl -L https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js -o reporter.js
                    '''
                }
            }
        }

        stage('Run Load Test') {
            steps {
                script {
                    // We execute the local k6 binary against your script
                    sh './k6 run load-test.js'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'summary.html', fingerprint: true
            
            // This publishes the report to the left sidebar of your Jenkins project
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
