from app.settings.setup import create_app

CONFIG_FILE = 'setting.py'

app = create_app(config_file=CONFIG_FILE)

from app.routes import api
