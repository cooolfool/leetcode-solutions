class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {


         int len = strs.length;

        // Map to store the grouped anagrams
        Map<String, List<String>> anagramGroups = new HashMap<>();

        // Sort each string and group them in the map
        for (int i = 0; i < len; i++) {
            char[] tempArray = strs[i].toCharArray();
            Arrays.sort(tempArray);
            String sortedString = new String(tempArray);

            // If the sorted string is not in the map, add a new group
            if (!anagramGroups.containsKey(sortedString)) {
                anagramGroups.put(sortedString, new ArrayList<>());
            }

            // Add the original string to its corresponding group
            anagramGroups.get(sortedString).add(strs[i]);
        }

        // Convert the map values to a list of lists
        List<List<String>> result = new ArrayList<>(anagramGroups.values());

        return result;
        // int len = strs.length;
        // String[] array = new String[len];
        // for(int i=0;i<len;i++){
        //     char[] tempArray = strs[i].toCharArray();
        //     Arrays.sort(tempArray);
        //     array[i]=tempArray;
        // }
        // Arrays.sort(array);
        // for(int i=0;i<len;i++){
        //     for(int j=i+1;j<len-1;j++){
        //         if()
        //     }
        // }
    }
}