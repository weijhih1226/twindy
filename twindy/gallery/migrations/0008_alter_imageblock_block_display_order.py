# Generated by Django 4.1 on 2023-02-10 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0007_alter_imageblock_block_display_order"),
    ]

    operations = [
        migrations.AlterField(
            model_name="imageblock",
            name="block_display_order",
            field=models.IntegerField(
                error_messages="請輸入不重複數字。",
                help_text="不重複數字",
                unique=True,
                verbose_name="區塊顯示順序",
            ),
        ),
    ]