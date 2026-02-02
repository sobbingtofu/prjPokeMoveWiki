import os
import json
import time # 시간 측정을 위해 추가
from dotenv import load_dotenv
from supabase import create_client

# 1. 환경 변수 로드
load_dotenv(".env.local")

URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TABLE_NAME = "TB_MOVES"
FILE_NAME = "KOREAN_MOVES.json" 

# Supabase 연결
if not URL or not KEY:
    print("ERROR : 환경 변수 로드 실패")
    exit()

supabase = create_client(URL, KEY)

def upload_in_batches():
    print(f"MSG : 파일 읽는 중: {FILE_NAME}...")
    
    try:
        with open(FILE_NAME, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"ERROR : 파일 읽기 오류: {e}")
        return

    total = len(data)
    batch_size = 50 
    
    print(f"MSG : 총 {total}개의 데이터를 {batch_size}개씩 나눠 업로드 진행.")
    start_time = time.time()

    for i in range(0, total, batch_size):
        batch = data[i : i + batch_size]
        current_batch_count = i + len(batch)
        
        print(f"MSG : [{current_batch_count}/{total}] 전송 중...", end="\r")
        
        try:
            response = supabase.table(TABLE_NAME).insert(batch).execute()
            print(f"BATCH SUCCESS : {current_batch_count} / {total} ({(current_batch_count/total)*100:2.1f}%)")
            
        except Exception as e:
            print(f"\nERROR : {i}번 인덱스 전송 중 에러 발생")
            print(f"ERROR : 상세 에러: {e}")
            break

    end_time = time.time()
    duration = end_time - start_time
    print(f"\n ALL SUCCESS : 모든 작업 완료 (소요 시간: {duration:2.1f}초)")

if __name__ == "__main__":
    upload_in_batches()