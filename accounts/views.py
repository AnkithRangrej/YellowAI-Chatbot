from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from django.conf import settings
from .serializers import RegisterSerializer, ProjectSerializer, PromptSerializer, ChatMessageSerializer
from .models import Project, Prompt, ChatMessage


# Import OpenAI client from new SDK
from openai import OpenAI

# Initialize OpenAI client with API key
client = OpenAI(api_key=settings.OPENAI_API_KEY)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PromptListCreateView(generics.ListCreateAPIView):
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prompt.objects.filter(project__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        project_id = request.data.get('project_id')
        prompt_text = request.data.get('prompt_text')

        if not project_id or not prompt_text:
            return Response({"error": "project_id and prompt_text required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id, user=user)
        except Project.DoesNotExist:
            return Response({"error": "Project not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

        try:
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",  # use cheaper model for testing
                messages=[{"role": "user", "content": prompt_text}],
            )
            response_text = completion.choices[0].message.content
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save user message
        ChatMessage.objects.create(project=project, sender='user', message=prompt_text)
        # Save bot response
        ChatMessage.objects.create(project=project, sender='bot', message=response_text)

        return Response({
            "project": project.name,
            "prompt": prompt_text,
            "response": response_text,
        })

class ChatHistoryView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        user = self.request.user
        return ChatMessage.objects.filter(project__id=project_id, project__user=user).order_by('timestamp')
