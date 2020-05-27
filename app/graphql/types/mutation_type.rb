module Types
  class MutationType < Types::BaseObject
    graphql_name "Mutation"

    field :create_signup, SignupGraphType, mutation: Mutations::CreateSignup
    field :destroy_signup, SignupGraphType, mutation: Mutations::DestroySignup

    field :update_user_house, UserGraphType, mutation: Mutations::UpdateUserHouse

    field :create_edit_individual_event, UserGraphType, mutation: Mutations::CreateEditIndividualEvent
    field :delete_individual_event, UserGraphType, mutation: Mutations::DeleteIndividualEvent
    field :approve_individual_events, [IndividualEventGraphType], mutation: Mutations::ApproveIndividualEvents
    field :reject_individual_events, [IndividualEventGraphType], mutation: Mutations::RejectIndividualEvents

    field :create_house, HouseGraphType, mutation: Mutations::CreateHouse
    field :update_house, HouseGraphType, mutation: Mutations::UpdateHouse
    field :delete_house, HouseGraphType, mutation: Mutations::DeleteHouse

    field :create_organization, OrganizationGraphType, mutation: Mutations::CreateOrganization
    field :update_organization, OrganizationGraphType, mutation: Mutations::UpdateOrganization
    field :delete_organization, OrganizationGraphType, mutation: Mutations::DeleteOrganization

    field :update_user, UserGraphType, mutation: Mutations::UpdateUser
    field :delete_user, UserGraphType, mutation: Mutations::DeleteUser

    field :create_event, EventGraphType, mutation: Mutations::CreateEvent
    field :update_event, EventGraphType, mutation: Mutations::UpdateEvent
    field :delete_event, EventGraphType, mutation: Mutations::DeleteEvent

    field :create_event_type, EventTypeGraphType, mutation: Mutations::CreateEventType
    field :update_event_type, EventTypeGraphType, mutation: Mutations::UpdateEventType
    field :delete_event_type, EventTypeGraphType, mutation: Mutations::DeleteEventType

    field :create_tag, TagGraphType, mutation: Mutations::CreateTag
    field :update_tag, TagGraphType, mutation: Mutations::UpdateTag
    field :delete_tag, TagGraphType, mutation: Mutations::DeleteTag

    field :confirm_profile_settings, UserPreferenceGraphType, mutation: Mutations::ConfirmProfileSettings
  end
end
