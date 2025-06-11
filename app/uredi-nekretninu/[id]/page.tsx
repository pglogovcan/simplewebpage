import { notFound } from "next/navigation"
import EditPropertyClient from "./edit-property-client"
import { getPropertyForEdit } from "@/app/actions/property-actions"

export const dynamic = "force-dynamic"

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyForEdit(params.id)

  if (!property) {
    notFound()
  }

  return <EditPropertyClient property={property} />
}
