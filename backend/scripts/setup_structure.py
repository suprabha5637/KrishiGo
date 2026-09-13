import os
import sys

def create_dirs_and_files():
    base_dir = "/Users/suprabhakundu/Suprabha/KrishiGo/backend"
    dirs = [
        "app/core", "app/database", "app/models", "app/schemas", "app/repositories",
        "app/services", "app/api/routes", "app/middleware", "app/utils",
        "alembic/versions", "scripts", "tests"
    ]
    
    for d in dirs:
        os.makedirs(os.path.join(base_dir, d), exist_ok=True)
        init_file = os.path.join(base_dir, d, "__init__.py")
        if not os.path.exists(init_file):
            with open(init_file, "w") as f:
                pass
                
    init_files = [
        "app/__init__.py",
        "app/api/__init__.py",
    ]
    for f in init_files:
        path = os.path.join(base_dir, f)
        if not os.path.exists(path):
            with open(path, "w") as file:
                pass

    print("Project structure created successfully.")

if __name__ == "__main__":
    create_dirs_and_files()
