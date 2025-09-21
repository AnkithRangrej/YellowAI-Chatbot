from django.urls import path
from .views import RegisterView, ProjectListCreateView, PromptListCreateView, ChatView, ChatHistoryView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('projects/', ProjectListCreateView.as_view()),
    path('prompts/', PromptListCreateView.as_view()),
    path('chat/', ChatView.as_view()),
    path('chat/history/<int:project_id>/', ChatHistoryView.as_view()),
]
