def test_register(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "phone": "+919876543211",
        "full_name": "Test User",
        "password": "password123",
        "role": "CUSTOMER"
    })
    assert response.status_code == 200
    assert response.json()["success"] == True
    assert "id" in response.json()["data"]

def test_login(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()["data"]
