from rest_framework import serializers
from django.contrib.auth import authenticate
from common.validators import validate_uz_phone
from .models import User

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="full_name", read_only=True)
    createdAt = serializers.DateTimeField(source="date_joined", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "phone",
            "email",
            "first_name",
            "last_name",
            "name",
            "role",
            "avatar",
            "is_verified",
            "createdAt",
        ]
        read_only_fields = ["id", "is_verified", "createdAt"]

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(validators=[validate_uz_phone])
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.CUSTOMER)

    def validate_phone(self, value):
        clean_phone = validate_uz_phone(value)
        if User.objects.filter(phone=clean_phone).exists():
            raise serializers.ValidationError("Ushbu telefon raqami bilan hisob allaqachon ro‘yxatdan o‘tgan.")
        return clean_phone

    def create(self, validated_data):
        name = validated_data.pop("name", "").strip()
        first_name = name
        last_name = ""
        if " " in name:
            parts = name.split(" ", 1)
            first_name, last_name = parts[0], parts[1]

        password = validated_data.pop("password")
        user = User.objects.create_user(
            password=password,
            first_name=first_name,
            last_name=last_name,
            **validated_data,
        )
        return user

class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        phone = validate_uz_phone(attrs.get("phone"))
        password = attrs.get("password")

        user = authenticate(username=phone, password=password)
        if not user:
            raise serializers.ValidationError("Telefon raqami yoki parol noto‘g‘ri kiritildi.")
        if not user.is_active:
            raise serializers.ValidationError("Foydalanuvchi hisobi faol emas yoki bloklangan.")

        attrs["user"] = user
        return attrs
