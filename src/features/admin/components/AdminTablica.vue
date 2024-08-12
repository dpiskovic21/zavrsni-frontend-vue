<script setup lang="ts">
	import type { Column } from '@/shared/interfaces';

	const props = defineProps<{
		podatci: unknown[];
		stupci: Column[];
	}>();

	const emit = defineEmits<{
		obrisi: [id: string];
	}>();
</script>

<template>
	<DataTable :value="podatci">
		<Column
			v-for="col of stupci"
			:key="col.field"
			:field="col.field"
			:header="col.header" />
		<Column>
			<template #body="slotProps">
				<Button
					icon="pi pi-trash"
					severity="danger"
					:text="true"
					@click="
						emit(
							'obrisi',
							slotProps.data.id
								? slotProps.data.id.toString()
								: slotProps.data.putanja
						)
					" />
			</template>
		</Column>
	</DataTable>
</template>
