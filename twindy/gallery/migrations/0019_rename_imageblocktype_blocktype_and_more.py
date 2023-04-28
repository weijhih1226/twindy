# Generated by Django 4.1 on 2023-02-15 07:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0018_rename_imagemetadata_imageinfo"),
    ]

    operations = [
        migrations.RenameModel(old_name="ImageBlockType", new_name="BlockType",),
        migrations.RemoveField(model_name="imageinfo", name="image_block_type",),
        migrations.AddField(
            model_name="imageinfo",
            name="block_type",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="image",
                to="gallery.blocktype",
                verbose_name="區塊種類",
            ),
        ),
    ]