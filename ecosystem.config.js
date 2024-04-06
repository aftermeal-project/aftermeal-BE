module.exports = {
  apps: [
    {
      name: 'sikhoo0',
      script: './dist/main.js',
      instances: 'max', // CPU 코어 수만큼 워커 프로세스 생성
      exec_mode: 'cluster', // fork 모드가 아닌 cluster 모드로 실행
      wait_ready: true, // 마스터 프로세스로부터 ready 이벤트 대기
      listen_timeout: 50000, // 'ready' 이벤트 수신 대기 시간값 (ms)
      kill_timeout: 5000, // 'SIGINT' 시그널 전송 대기 시간값 (ms)
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
