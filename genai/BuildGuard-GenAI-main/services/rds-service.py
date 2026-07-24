import mysql.connector
from config.config import settings


class RDSService:

    def get_connection(self):
        """Create MySQL (Amazon RDS) connection"""
        return mysql.connector.connect(
            host=settings.rds_host,
            port=settings.rds_port,
            user=settings.rds_user,
            password=settings.rds_password,
            database=settings.rds_db_name
        )

    def get_inspection_report(self, report_id):
        """Fetch inspection report by ID"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM inspection_reports WHERE id = %s"
        cursor.execute(query, (report_id,))
        report = cursor.fetchone()

        cursor.close()
        conn.close()

        return report

    def get_worker_logs(self):
        """Fetch worker logs"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM worker_logs")
        logs = cursor.fetchall()

        cursor.close()
        conn.close()

        return logs

    def get_safety_checklist(self):
        """Fetch safety checklist"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM safety_checklist")
        checklist = cursor.fetchall()

        cursor.close()
        conn.close()

        return checklist


# Create singleton instance
rds_service = RDSService()