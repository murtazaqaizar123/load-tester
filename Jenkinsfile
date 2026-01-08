pipeline {
    agent any

    environment {
        K6_BROWSER_ENABLED = 'true'
        // We tell k6 exactly where we are going to download Chromium
        K6_BROWSER_EXECUTABLE_PATH = "${WORKSPACE}/chrome-linux/chrome"
        // These flags are mandatory for running Chrome inside a Docker/Coolify container
        K6_BROWSER_ARGS = 'no-sandbox,disable-setuid-sandbox,disable-dev-shm-usage,disable-gpu,single-process'
    }

    stages {
        stage('Cleanup') {
            steps {
                // Clean up previous failed attempts
                sh 'rm -rf k6 reporter.js chrome-linux'
            }
        }

        stage('Install Tools') {
            steps {
                script {
                    echo "Downloading k6..."
                    sh 'curl -L https://github.com/grafana/k6/releases/download/v0.51.0/k6-v0.51.0-linux-amd64.tar.gz | tar -xz --strip-components 1'
                    
                    echo "Downloading k6-reporter..."
                    sh 'curl -L https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js -o reporter.js'
                    
                    echo "Downloading Portable Chromium (this may take a minute)..."
                    // This fetches a specific portable build of Chromium for Linux
                    sh '''
                        curl -L https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F1000027%2Fchrome-linux.zip?alt=media -o chrome.zip
                        unzip -q chrome.zip
                        rm chrome.zip
                        chmod +x ./chrome-linux/chrome
                    '''
                }
            }
        }

        stage('Run Load Test') {
            steps {
                // We use the local k6 binary to run the test
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
