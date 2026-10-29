
from django.contrib import admin
from .models import Assignment
# Register your models here.

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'unit_name',
        'due_date',
        'priority',
        'status',
        'user',
    )

    list_filter = ('status', 'priority', 'unit_name')
    search_fields = ('title', 'unit_name')
    ordering = ('due_date',)
