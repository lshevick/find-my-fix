# Generated by Django 4.0.5 on 2022-07-18 16:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cars', '0005_alter_car_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shop', models.CharField(max_length=255)),
                ('image', models.ImageField(null=True, upload_to='')),
                ('date', models.DateField(auto_now_add=True)),
                ('note', models.TextField(max_length=300)),
                ('service', models.JSONField()),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='records', to='cars.car')),
                ('user', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
