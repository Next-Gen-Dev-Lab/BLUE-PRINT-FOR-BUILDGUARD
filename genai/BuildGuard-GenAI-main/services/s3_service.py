import boto3
from botocore.exceptions import ClientError


class S3Service:
    def __init__(self, bucket_name, region_name="us-east-1"):
        self.bucket_name = bucket_name
        self.s3 = boto3.client("s3", region_name=region_name)

    def download_file(self, s3_key, local_path):
        try:
            self.s3.download_file(self.bucket_name, s3_key, local_path)
            print(f"Downloaded {s3_key} to {local_path}")
            return True
        except ClientError as e:
            print(f"Error downloading file: {e}")
            return False