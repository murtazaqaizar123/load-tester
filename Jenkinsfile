pipeline {
    agent any

    environment {
        K6_BROWSER_ENABLED = 'true'
        // Tell k6 where to find the browser we are about to download
        K6_BROWSER_EXECUTABLE_PATH = "${WORKSPACE}/chrome-linux/chrome"
        K6_BROWSER_ARGS = 'no-sandbox,disable-setuid-sandbox,disable-dev-shm-usage,disable-gpu,single-process'
    }

    stages {
        stage('Cleanup') {
            steps {
                sh 'rm -rf k6 reporter.js chrome-linux chrome.zip'
            }
        }

        stage('Install Tools') {
            steps {
                script {
                    echo "Downloading k6..."
                    sh 'curl -L https://github.com/grafana/k6/releases/download/v0.51.0/k6-v0.51.0-linux-amd64.tar.gz | tar -xz --strip-components 1'
                    
                    echo "Downloading k6-reporter..."
                    sh 'curl -L https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js -o reporter.js'
                    
                    echo "Downloading Chromium..."
                    // Using a reliable Playwright-hosted Chromium build
                    sh '''
                        curl -L "https://playwright.azureedge.net/builds/chromium/1088/chromium-linux.zip" -o chrome.zip
                        unzip -q chrome.zip
                        chmod +x ./chrome-linux/chrome
                    '''
                }
            }
        }

        stage('Run Load Test') {
            steps {
                // Ensure k6 version is correct and run the test
                sh './k6 version'
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
