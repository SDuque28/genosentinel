from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientReportViewSet, ReportVariantViewSet, AvailablePatientsView

router = DefaultRouter()
router.register(r'reports', PatientReportViewSet, basename='report')
router.register(r'report-variants', ReportVariantViewSet, basename='report-variant')

urlpatterns = [
    path('', include(router.urls)),
    path('patients/', AvailablePatientsView.as_view(), name='available-patients'),
]