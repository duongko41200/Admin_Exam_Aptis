export const countWord = (value: string)=>{
	
	return value.trim().split(/\s+/).length;
}