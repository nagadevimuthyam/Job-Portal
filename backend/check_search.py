import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','config.settings')
import django
django.setup()
from apps.accounts.models import User
from apps.organizations.models import Organization
from apps.candidates.models import CandidateProfile
from apps.employer.services.search_filters import build_candidate_search_queryset, apply_search_filters
org = Organization.objects.create(name='Test Org', code='TEST10', address='Address', contact_number='123456')
employer = User.objects.create_user(email='emp@test.com', password='pass', full_name='Emp', role=User.Role.EMPLOYER, organization=org)
candidate_user = User.objects.create_user(email='cand@test.com', password='pass', full_name='Cand', role=User.Role.CANDIDATE)
profile = CandidateProfile.objects.create(user=candidate_user, full_name='Cand', email='cand@test.com', phone='9999999999', location='Remote', summary='Backend engineer', work_status='EXPERIENCED', availability_to_join='IMMEDIATE', notice_period_code=None, is_searchable=True)
print('profile created', profile.id)
print('pre count', build_candidate_search_queryset().count())
qs = apply_search_filters(build_candidate_search_queryset(), {'notice_period_code': 'IMMEDIATE_JOINER'})
print('qs count', qs.count())
