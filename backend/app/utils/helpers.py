import random
import string
import re
import datetime

def generate_order_number() -> str:
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"ORD-{timestamp}-{random_str}"

def generate_batch_number() -> str:
    timestamp = datetime.datetime.now().strftime("%Y%m%d")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"BATCH-{timestamp}-{random_str}"

def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def format_currency(amount: float) -> str:
    return f"₹{amount:,.2f}"
