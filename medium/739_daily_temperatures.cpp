class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        stack<pair<int,int>>s;
        vector<int>output;
        int currnt,next;
        for(int i=temperatures.size()-1;i>=0;i--){
            if(s.empty())
                output.push_back(0);
            else {
                if(temperatures[i]<s.top().first)
                    output.push_back(s.top().second-i);
                else if(temperatures[i]>=s.top().first){
                    while(s.size()!=0 and temperatures[i]>=s.top().first){
                        s.pop();
                    }
                    if(s.empty())
                        output.push_back(0);
                    else if(temperatures[i]<s.top().first)
                        output.push_back(s.top().second-i);
                }
            }
             s.push({temperatures[i],i});
        }
         reverse(output.begin(),output.end());
        return output;
    }
};