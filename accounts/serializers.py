from rest_framework import serializers

from dj_rest_auth.serializers import TokenModel

from .models import User

class UserSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField (source='user.username')
    class Meta:
        model = User
        fields = '__all__'