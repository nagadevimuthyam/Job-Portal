import EditSectionModal from "../EditSectionModal";

export default function FormModal({
  open,
  title,
  onClose,
  onSubmit,
  primaryLabel,
  secondaryLabel,
  children,
}) {
  return (
    <EditSectionModal
      open={open}
      title={title}
      onClose={onClose}
      onSubmit={onSubmit}
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
    >
      {children}
    </EditSectionModal>
  );
}
