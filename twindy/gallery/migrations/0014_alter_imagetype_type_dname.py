# Generated by Django 4.1 on 2023-02-15 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0013_remove_imagemetadata_image_block"),
    ]

    operations = [
        migrations.AlterField(
            model_name="imagetype",
            name="type_dname",
            field=models.CharField(
                blank=True, max_length=30, null=True, verbose_name="種類顯示名稱"
            ),
        ),
    ]
