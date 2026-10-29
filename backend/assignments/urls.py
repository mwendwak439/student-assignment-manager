
from django.urls import path
from .views import (
    api_home,
    csrf_token,
    assignment_list_create,
    assignment_detail,
    register_user,
    login_user,
    logout_user,
    current_user,
)

urlpatterns = [
    path('', api_home, name='api-home'),
    path('csrf/', csrf_token, name='csrf-token'),
    path('assignments/',assignment_list_create,name='assignment-list-create'),
    path('assignments/<int:pk>/',assignment_detail,name='assignment-detail'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('me/', current_user, name='current-user'),
]
