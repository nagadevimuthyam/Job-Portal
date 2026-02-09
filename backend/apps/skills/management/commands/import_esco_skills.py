import csv
from pathlib import Path

from django.core.management.base import BaseCommand

from apps.skills.models import Skill, normalize_skill_name


class Command(BaseCommand):
    help = "Import ESCO skills.csv into Skill master."

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            default="backend/seed/esco/skills.csv",
            help="Path to ESCO skills.csv",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Optional limit for number of rows to import",
        )

    def handle(self, *args, **options):
        path = Path(options["path"])
        limit = options["limit"]

        if not path.exists():
            self.stderr.write(self.style.ERROR(f"File not found: {path}"))
            return

        created = 0
        batch = []
        batch_size = 2000

        with path.open("r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for idx, row in enumerate(reader, start=1):
                name = (row.get("PREFERREDLABEL") or "").strip()
                if not name:
                    continue

                normalized = normalize_skill_name(name)
                if not normalized:
                    continue

                alt_labels = (row.get("ALTLABELS") or "").strip()
                source_uri = (row.get("ORIGINURI") or "").strip()

                batch.append(
                    Skill(
                        name=name,
                        normalized_name=normalized,
                        alt_labels=alt_labels,
                        source_uri=source_uri,
                    )
                )

                if len(batch) >= batch_size:
                    Skill.objects.bulk_create(batch, ignore_conflicts=True)
                    created += len(batch)
                    batch = []
                    self.stdout.write(self.style.SUCCESS(f"Imported {created} rows..."))

                if limit and idx >= limit:
                    break

        if batch:
            Skill.objects.bulk_create(batch, ignore_conflicts=True)
            created += len(batch)

        self.stdout.write(self.style.SUCCESS(f"Import complete. Processed {created} rows."))
