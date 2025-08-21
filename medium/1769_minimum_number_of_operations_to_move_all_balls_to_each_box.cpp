class Solution {
public:
    vector<int> minOperations(string boxes) {
        int n=boxes.size();
        vector<int>v;
        for(int i=0;i<n;i++)
        {
            int count=0;
            for(int j=0;j<n;j++)
            {
                if(boxes[j]=='1')
                    count+=abs(j-i);
            }
            v.push_back(count);
        }
        return v;
    }
};