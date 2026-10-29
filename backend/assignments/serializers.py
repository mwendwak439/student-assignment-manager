
from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assignment

        fields = [
            'id',
            'title',
            'description',
            'unit_name',
            'due_date',
            'priority',
            'status',
            'created_at',
        ]

        read_only_fields = ['id', 'created_at']
