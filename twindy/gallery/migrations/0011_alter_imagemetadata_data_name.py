# Generated by Django 4.1 on 2023-02-10 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0010_alter_imagemetadata_data_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="imagemetadata",
            name="data_name",
            field=models.CharField(help_text="必填", max_length=30, verbose_name="資料名稱"),
        ),
    ]