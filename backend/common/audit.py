from common.models import AuditLog

def record_audit_log(actor, action, entity, entity_id, metadata=None, request=None):
    ip_address = None
    if request:
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(",")[0].strip()
        else:
            ip_address = request.META.get("REMOTE_ADDR")

    return AuditLog.objects.create(
        actor=actor if (actor and actor.is_authenticated) else None,
        action=action,
        entity=entity,
        entity_id=str(entity_id),
        metadata=metadata or {},
        ip_address=ip_address,
    )
