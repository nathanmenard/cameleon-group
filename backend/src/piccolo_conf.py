"""Piccolo configuration for migrations"""

from piccolo.conf.apps import AppRegistry

from db import DB

APP_REGISTRY = AppRegistry(apps=["piccolo.apps.migrations.piccolo_app"])
