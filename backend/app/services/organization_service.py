from app.models import db, Organization, User


def get_logged_in_user(user_id):
    return User.query.get(user_id) if user_id else None


def create_organization_service(user, name, description):
    organization = Organization(name=name, description=description)
    organization.users.append(user)
    db.session.add(organization)
    db.session.commit()
    return organization


def join_organization_service(user, invite_code):
    organization = Organization.query.filter_by(invite_code=invite_code).first()
    if organization:
        user.organizations.append(organization)
        db.session.commit()
        return organization
    return None


def activate_organization_service(user, organization_id):
    user.active_organization_id = organization_id
    db.session.commit()


def deactivate_organization_service(user):
    user.active_organization_id = None
    db.session.commit()
